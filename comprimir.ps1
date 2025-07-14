Compress-Archive `
  -Path (Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules(\\|$)' }).FullName `
  -DestinationPath .\desktop.zip
