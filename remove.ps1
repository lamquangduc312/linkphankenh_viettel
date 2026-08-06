$c = Get-Content -Path index.html -Encoding utf8
$c[0..251] + $c[802..($c.Length-1)] | Set-Content -Path index.html -Encoding utf8
