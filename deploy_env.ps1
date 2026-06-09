$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#].*?)=(.*)$') {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim().Trim('"')
        if ($key) {
            Write-Host "Adding $key..."
            # Provide value via stdin to vercel env add
            $val | npx.cmd vercel@latest env add $key production
            $val | npx.cmd vercel@latest env add $key preview
        }
    }
}
npx.cmd vercel@latest --prod --yes
