# PowerShell script to update imports from relative paths to @/ alias

$rootPath = "d:\WORK\webverse\montauk-nextjs"
$folders = @("components", "hooks")

foreach ($folder in $folders) {
    $files = Get-ChildItem -Path "$rootPath\$folder" -Recurse -Filter "*.tsx" -File
    $files += Get-ChildItem -Path "$rootPath\$folder" -Recurse -Filter "*.ts" -File
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        
        # Replace relative imports with @/ imports
        $content = $content -replace "from '\.\./types", "from '@/types"
        $content = $content -replace 'from "\.\./types', 'from "@/types'
        $content = $content -replace "from '\.\./\.\./types", "from '@/types"
        $content = $content -replace 'from "\.\./\.\./types', 'from "@/types'
        
        $content = $content -replace "from '\.\./data", "from '@/data"
        $content = $content -replace 'from "\.\./data', 'from "@/data'
        $content = $content -replace "from '\.\./\.\./data", "from '@/data"
        $content = $content -replace 'from "\.\./\.\./data', 'from "@/data'
        
        $content = $content -replace "from '\.\./hooks", "from '@/hooks"
        $content = $content -replace 'from "\.\./hooks', 'from "@/hooks'
        $content = $content -replace "from '\.\./\.\./hooks", "from '@/hooks"
        $content = $content -replace 'from "\.\./\.\./hooks', 'from "@/hooks'
        
        $content = $content -replace "from '\.\./components", "from '@/components"
        $content = $content -replace 'from "\.\./components', 'from "@/components'
        $content = $content -replace "from '\.\./\.\./components", "from '@/components"
        $content = $content -replace 'from "\.\./\.\./components', 'from "@/components'
        
        # Add 'use client' to component files if they use hooks or have event handlers
        if ($file.Extension -eq ".tsx" -and $folder -eq "components") {
            if ($content -match "useState|useEffect|useCallback|useMemo|useRef|onClick|onChange|onSubmit") {
                if ($content -notmatch "'use client'") {
                    $content = "'use client';`n`n" + $content
                }
            }
        }
        
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Import paths updated successfully!"
