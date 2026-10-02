param([string]$Email = 'makesake632@gmail.com')
$ErrorActionPreference = 'Stop'
$securePassword = Read-Host "Новый пароль администратора (14–72 байта)" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $byteCount = [Text.Encoding]::UTF8.GetByteCount($plainPassword)
    if ($byteCount -lt 14 -or $byteCount -gt 72) { throw 'Пароль должен занимать от 14 до 72 байт в UTF-8.' }
    $OutputEncoding = [Text.UTF8Encoding]::new($false)
    $plainPassword | docker compose exec -T api /clinic-admin -email $Email
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось сохранить администратора.' }
} finally {
    $plainPassword = $null
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $securePassword.Dispose()
}
