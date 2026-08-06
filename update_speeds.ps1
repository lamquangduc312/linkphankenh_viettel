$content = Get-Content index.html -Encoding utf8

$speeds = @{
    'Meshvt1' = '300 Mbps'
    'Meshvt2' = '400 Mbps'
    'Meshvt3' = '500 Mbps'
    'Meshvt4' = '1 Gbps'
    'Giga1' = '1 Gbps'
    'Giga2' = '1 Gbps'
    'Giga3' = '1 Gbps'
    'Giga4' = '1 Gbps'
    'Netvt1' = '200 Mbps'
    'Netvt2' = '250 Mbps'
}

$current_pkg = ""

for ($i=0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match '<h3>(.*?)</h3>') {
        $current_pkg = $matches[1]
    }
    
    if ($content[$i] -match '<strong>Cao</strong>') {
        if ($speeds.ContainsKey($current_pkg)) {
            $speed = $speeds[$current_pkg]
            $content[$i] = $content[$i] -replace '<strong>Cao</strong>', "<strong>$speed</strong>"
        }
    }
    
    if ($content[$i] -match 'Home Wifi') {
        $content[$i] = $content[$i] -replace 'Home Wifi', 'Mesh wifi'
    }
}

$content | Set-Content index.html -Encoding utf8
