import { Button } from '@/components/ui/button'
import { CodeIcon, Download, Monitor, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react'
import React, { useEffect } from 'react'
import ViewCodeBlock from './ViewCodeBlock';

const HTML_CODE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite CSS & JS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+zQj+Mj7Vp7k8E5x29nLNX6j+CWeN/Xg7fGqOpM8R1+a5/fQ1fJbO1Tz2uE5wP5yQ5uI5uA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Chart.js for charts & graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- AOS (Animate On Scroll) for scroll animations -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- GSAP (GreenSock) for advanced animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie for JSON-based animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper.js for sliders/carousels -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Optional: Tooltip & Popover library (Tippy.js) -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    
    <script>
        // Close all modals on page load
        window.addEventListener('DOMContentLoaded', function() {
            // Hide all Flowbite modals
            const modals = document.querySelectorAll('[data-modal-target], [id*="modal"]');
            modals.forEach(modal => {
                if (modal.classList) {
                    modal.classList.add('hidden');
                }
            });
            
            // Remove modal backdrop overlays
            const backdrops = document.querySelectorAll('[modal-backdrop]');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Ensure body is not locked
            document.body.style.overflow = 'auto';
            document.body.classList.remove('overflow-hidden');
        });
    </script>
</head>
<body>
    {code}
</body>
</html>`;

const WebPageTools = ({selectedScreenSize,setSelectedScreenSize,generatedCode,getCurrentCode}:any) => {
    const [finalCode,setFinalCode]=React.useState<string>("");
    
    useEffect(()=>{
        const cleanCode=(HTML_CODE.replace('{code}',generatedCode) || '')
        .replaceAll("```html","")
        .replace('```','')
        .replace('html','')
        setFinalCode(cleanCode)
    },[generatedCode])
    
    const getFinalCode = () => {
        // Get the current edited code from iframe
        const currentCode = getCurrentCode ? getCurrentCode() : generatedCode;
        const cleanCode = (HTML_CODE.replace('{code}', currentCode) || '')
            .replaceAll("```html","")
            .replace('```','')
            .replace('html','');
        return cleanCode;
    }
    
    const ViewInNewTab = () => {
        const codeToView = getFinalCode();
        if(!codeToView) return;

        const blob = new Blob([codeToView], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    
    const downloadCode=()=>{
        const codeToDownload = getFinalCode();
        if(!codeToDownload) return;
        
        const blob = new Blob([codeToDownload], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

  return (
    <div className='p-2 shadow w-full rounded-2xl flex items-center justify-between'>
        <div className='flex gap-2'>
            <Button variant={'ghost'} 
            className={`border-2 ${selectedScreenSize === 'web' ? 'border-primary' : 'border-transparent'}`}
            onClick={()=>setSelectedScreenSize('web')}><Monitor /></Button>
            <Button variant={'ghost'}
            className={`border-2 ${selectedScreenSize === 'mobile' ? 'border-primary' : 'border-transparent'}`}             
            onClick={()=>setSelectedScreenSize('mobile')}><TabletSmartphone /></Button>
        </div>
        <div className='flex gap-2'>
            <Button variant={'outline'} onClick={()=>ViewInNewTab()}>
                View <SquareArrowOutUpRight />
            </Button>
            <ViewCodeBlock getCode={getFinalCode}>
                <Button asChild>
                    <span>View Code <CodeIcon /></span>
                </Button>
            </ViewCodeBlock>
            <Button onClick={downloadCode}><span>Download</span><Download /></Button>
        </div>
    </div>
  )
}

export default WebPageTools