# Run from any directory: powershell -ExecutionPolicy Bypass -File tests/serve.ps1
# Local-only static preview; stop with Ctrl+C. No installation or external access.
param([int]$Port = 8081)
$previewRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$previewPrefix = $previewRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$contentTypes = @{'.html'='text/html; charset=utf-8';'.css'='text/css; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.svg'='image/svg+xml';'.jpg'='image/jpeg';'.png'='image/png';'.webp'='image/webp';'.md'='text/plain; charset=utf-8';'.json'='application/json';'.txt'='text/plain; charset=utf-8'}
$listener.Start()
Write-Output "Preview: http://127.0.0.1:$Port/"
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 3000
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      if (-not $requestLine) { continue }
      while ($reader.ReadLine()) { }
      $parts = $requestLine.Split(' ')
      $requestPath = [Uri]::UnescapeDataString(($parts[1].Split('?')[0])).TrimStart('/')
      if (-not $requestPath) { $requestPath = 'index.html' }
      $target = [IO.Path]::GetFullPath((Join-Path $previewRoot $requestPath))
      $extension = [IO.Path]::GetExtension($target).ToLowerInvariant()
      $status = '200 OK'
      if (-not $target.StartsWith($previewPrefix, [StringComparison]::OrdinalIgnoreCase) -or -not $contentTypes.ContainsKey($extension) -or -not [IO.File]::Exists($target)) {
        $status = '404 Not Found'
        $body = [Text.Encoding]::UTF8.GetBytes('Not found')
        $contentType = 'text/plain'
      } else {
        $body = [IO.File]::ReadAllBytes($target)
        $contentType = $contentTypes[$extension]
      }
      $headers = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n")
      $stream.Write($headers, 0, $headers.Length)
      if ($parts[0] -ne 'HEAD') { $stream.Write($body, 0, $body.Length) }
      $stream.Flush()
    } catch { Write-Verbose $_.Exception.Message }
    finally { $client.Close() }
  }
} finally { $listener.Stop() }
