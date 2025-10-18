'use client'
import React, { useEffect, useRef } from 'react'
import WebPageTools from './WebPageTools'
import Settings from './Settings'
import ImageSettingsSection from './ImageSettingsSection'

type Props = {
    generatedCode:string
}
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
            // Hide all Flowbite modals and dialogs
            const modals = document.querySelectorAll('[data-modal-target], [id*="modal"], [id*="Modal"], [role="dialog"], .modal, [data-modal-show]');
            modals.forEach(modal => {
                if (modal.classList) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                }
                // Remove aria-modal attribute
                modal.removeAttribute('aria-modal');
                modal.setAttribute('aria-hidden', 'true');
            });
            
            // Remove modal backdrop overlays
            const backdrops = document.querySelectorAll('[modal-backdrop], .modal-backdrop, [data-modal-backdrop]');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            
            // Hide any elements with fixed positioning that might be modals
            const fixedElements = document.querySelectorAll('[class*="fixed"]');
            fixedElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.position === 'fixed' && 
                    (el.classList.contains('bg-black') || 
                     el.style.backgroundColor?.includes('black') ||
                     computedStyle.backgroundColor?.includes('0, 0, 0'))) {
                    el.style.display = 'none';
                }
            });
            
            // Ensure body is not locked
            document.body.style.overflow = 'auto';
            document.body.classList.remove('overflow-hidden');
            
            // Element selection functionality
            let hoverEl = null;
            let selectedEl = null;
            
            document.body.addEventListener('mouseover', function(e) {
                if (selectedEl) return;
                const target = e.target;
                if (target === document.body || target === document.documentElement) return;
                
                if (hoverEl && hoverEl !== target) {
                    hoverEl.style.outline = '';
                }
                hoverEl = target;
                hoverEl.style.outline = '2px dotted blue';
            });
            
            document.body.addEventListener('mouseout', function(e) {
                if (selectedEl) return;
                if (hoverEl) {
                    hoverEl.style.outline = '';
                    hoverEl = null;
                }
            });
            
            document.body.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const target = e.target;
                
                if (target === document.body || target === document.documentElement) return;
                
                if (selectedEl && selectedEl !== target) {
                    selectedEl.style.outline = '';
                    selectedEl.removeAttribute('contenteditable');
                }
                
                selectedEl = target;
                selectedEl.style.outline = '2px solid red';
                
                // Don't make images contenteditable, only other elements
                if (selectedEl.tagName !== 'IMG') {
                    selectedEl.setAttribute('contenteditable', 'true');
                    selectedEl.focus();
                }
                
                console.log('Selected element:', selectedEl);
                console.log('Element tag name:', selectedEl.tagName);
                
                // Notify parent window with element tag name
                window.parent.postMessage({ 
                    type: 'elementSelected',
                    tagName: selectedEl.tagName
                }, '*');
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && selectedEl) {
                    selectedEl.style.outline = '';
                    selectedEl.removeAttribute('contenteditable');
                    selectedEl = null;
                    console.log('Deselected');
                    
                    // Notify parent window
                    window.parent.postMessage({ type: 'elementDeselected' }, '*');
                }
            });
            
            console.log('Element selection initialized');
        });
        
        // Listen for style changes from parent - OUTSIDE DOMContentLoaded
        window.addEventListener('message', function(e) {
            console.log('Message received in iframe:', e.data);
            
            // Get the currently selected element each time a message is received
            const selectedElements = document.querySelectorAll('[contenteditable="true"], [style*="outline: red solid 2px"]');
            const currentSelectedEl = selectedElements.length > 0 ? selectedElements[0] : null;
            
            console.log('Found selected element:', currentSelectedEl);
            console.log('Element tag name:', currentSelectedEl?.tagName);
            
            if (e.data.type === 'updateFontSize' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('font-size', e.data.value + 'px', 'important');
                console.log('Font size updated to:', e.data.value + 'px');
            }
            
            if (e.data.type === 'updateTextColor' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('color', e.data.value, 'important');
                console.log('Text color updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateTextAlign' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('text-align', e.data.value, 'important');
                console.log('Text align updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateBackgroundColor' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('background-color', e.data.value, 'important');
                console.log('Background color updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateBorderRadius' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('border-radius', e.data.value, 'important');
                console.log('Border radius updated to:', e.data.value);
            }
            
            if (e.data.type === 'updatePadding' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('padding', e.data.value, 'important');
                console.log('Padding updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateMargin' && currentSelectedEl) {
                currentSelectedEl.style.setProperty('margin', e.data.value, 'important');
                console.log('Margin updated to:', e.data.value);
            }
            
            if (e.data.type === 'addClass' && currentSelectedEl) {
                currentSelectedEl.classList.add(e.data.className);
                console.log('Class added:', e.data.className);
            }
            
            if (e.data.type === 'removeClass' && currentSelectedEl) {
                currentSelectedEl.classList.remove(e.data.className);
                console.log('Class removed:', e.data.className);
            }
            
            if (e.data.type === 'getClasses' && currentSelectedEl) {
                const classes = Array.from(currentSelectedEl.classList);
                window.parent.postMessage({ 
                    type: 'classesResponse', 
                    classes: classes 
                }, '*');
            }
            
            // Image-specific updates
            if (e.data.type === 'updateImageSrc' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.setAttribute('src', e.data.value);
                console.log('Image src updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateImageAlt' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.setAttribute('alt', e.data.value);
                console.log('Image alt updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateImageWidth' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.style.setProperty('width', e.data.value, 'important');
                console.log('Image width updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateImageHeight' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.style.setProperty('height', e.data.value, 'important');
                console.log('Image height updated to:', e.data.value);
            }
            
            // Image styling updates (border-radius, margin, padding)
            if (e.data.type === 'updateImageBorderRadius' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.style.setProperty('border-radius', e.data.value, 'important');
                console.log('Image border radius updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateImageMargin' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.style.setProperty('margin', e.data.value, 'important');
                console.log('Image margin updated to:', e.data.value);
            }
            
            if (e.data.type === 'updateImagePadding' && currentSelectedEl && currentSelectedEl.tagName === 'IMG') {
                currentSelectedEl.style.setProperty('padding', e.data.value, 'important');
                console.log('Image padding updated to:', e.data.value);
            }
        });
    </script>
</head>
<body>
    {code}
</body>
</html>`;
const Design = ({ generatedCode}:Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = React.useState<'web' | 'mobile'>('web');
  const [isElementSelected, setIsElementSelected] = React.useState(false);
  const [isImageSelected, setIsImageSelected] = React.useState(false);
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>([]);
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const [iframeKey, setIframeKey] = React.useState(0); // Force iframe reload

  // Force iframe reload on component mount
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML_CODE.replace('{code}', generatedCode || ''));
    doc.close();
    
    console.log('Iframe reloaded with updated HTML_CODE template');
  }, [generatedCode, iframeKey]);

  useEffect(() => {
    // Listen for messages from iframe about element selection
    const handleMessage = (event: MessageEvent) => {
      console.log('Parent received message:', event.data);
      if (event.data.type === 'elementSelected') {
        console.log('Setting isElementSelected to true');
        setIsElementSelected(true);
        
        // Check if selected element is an image
        const isImage = event.data.tagName === 'IMG';
        console.log('Tag name received:', event.data.tagName);
        console.log('Is image selected:', isImage);
        setIsImageSelected(isImage);
        
        // Request classes from selected element
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage({ type: 'getClasses' }, '*');
        }
      } else if (event.data.type === 'elementDeselected') {
        console.log('Setting isElementSelected to false');
        setIsElementSelected(false);
        setIsImageSelected(false);
        setSelectedClasses([]);
      } else if (event.data.type === 'classesResponse') {
        setSelectedClasses(event.data.classes || []);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Function to get the current edited HTML from iframe
  const getCurrentCode = () => {
    if (!iframeRef.current) return generatedCode;
    const doc = iframeRef.current.contentDocument;
    if (!doc || !doc.body) return generatedCode;
    
    // Get the body's innerHTML (the edited content)
    const bodyContent = doc.body.innerHTML;
    
    // Remove any outlines added by the selection tool
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bodyContent;
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      (el as HTMLElement).style.outline = '';
      el.removeAttribute('contenteditable');
    });
    
    return tempDiv.innerHTML;
  };

  // Function to update selected element's font size
  const updateFontSize = (fontSize: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    // Send message to iframe to update font size
    iframe.contentWindow?.postMessage({ 
      type: 'updateFontSize', 
      value: fontSize 
    }, '*');
  };

  // Function to update selected element's text color
  const updateTextColor = (color: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    // Send message to iframe to update text color
    iframe.contentWindow?.postMessage({ 
      type: 'updateTextColor', 
      value: color 
    }, '*');
  };

  // Function to update text alignment
  const updateTextAlign = (align: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateTextAlign', 
      value: align 
    }, '*');
  };

  // Function to update background color
  const updateBackgroundColor = (color: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateBackgroundColor', 
      value: color 
    }, '*');
  };

  // Function to update border radius
  const updateBorderRadius = (radius: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateBorderRadius', 
      value: radius 
    }, '*');
  };

  // Function to update padding
  const updatePadding = (padding: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updatePadding', 
      value: padding 
    }, '*');
  };

  // Function to update margin
  const updateMargin = (margin: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateMargin', 
      value: margin 
    }, '*');
  };

  // Function to add class
  const handleAddClass = (className: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'addClass', 
      className: className 
    }, '*');
    
    setSelectedClasses(prev => [...prev, className]);
  };

  // Function to remove class
  const handleRemoveClass = (className: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'removeClass', 
      className: className 
    }, '*');
    
    setSelectedClasses(prev => prev.filter(c => c !== className));
  };

  // Image-specific handlers
  const updateImageSrc = (src: string) => {
    console.log('updateImageSrc called with:', src);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageSrc', 
      value: src 
    }, '*');
  };

  const updateImageAlt = (alt: string) => {
    console.log('updateImageAlt called with:', alt);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageAlt', 
      value: alt 
    }, '*');
  };

  const updateImageWidth = (width: string) => {
    console.log('updateImageWidth called with:', width);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageWidth', 
      value: width 
    }, '*');
  };

  const updateImageHeight = (height: string) => {
    console.log('updateImageHeight called with:', height);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageHeight', 
      value: height 
    }, '*');
  };

  // Image-specific styling handlers
  const updateImageBorderRadius = (radius: string) => {
    console.log('updateImageBorderRadius called with:', radius);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageBorderRadius', 
      value: radius 
    }, '*');
  };

  const updateImageMargin = (margin: string) => {
    console.log('updateImageMargin called with:', margin);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImageMargin', 
      value: margin 
    }, '*');
  };

  const updateImagePadding = (padding: string) => {
    console.log('updateImagePadding called with:', padding);
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    
    iframe.contentWindow?.postMessage({ 
      type: 'updateImagePadding', 
      value: padding 
    }, '*');
  };

  // Debug logging
  console.log('Current isElementSelected state:', isElementSelected);
  console.log('Current isImageSelected state:', isImageSelected);

  return (
    <div className='flex gap-2 w-full'>
      <div className='p-5 flex-1 h-[89vh] overflow-auto flex justify-center items-center flex-col'>
      <iframe 
          key={iframeKey}
          ref={iframeRef}
          className={` h-[75vh] rounded-xl border-2 transition-all duration-500 ${
            selectedScreenSize === 'mobile' ? 'w-[375px]' : 'w-full'
          }`}
          sandbox='allow-scripts allow-same-origin'
          title='Generated Design'
        />
      <WebPageTools 
        selectedScreenSize={selectedScreenSize} 
        setSelectedScreenSize={(v:string)=>setSelectedScreenSize(v as 'web' | 'mobile')}
        generatedCode={generatedCode}
        getCurrentCode={getCurrentCode}
      />
    </div>
    {isElementSelected && (
      isImageSelected ? (
        <ImageSettingsSection 
          onImageSrcChange={updateImageSrc}
          onImageAltChange={updateImageAlt}
          onImageWidthChange={updateImageWidth}
          onImageHeightChange={updateImageHeight}
          onBorderRadiusChange={updateImageBorderRadius}
          onMarginChange={updateImageMargin}
          onPaddingChange={updateImagePadding}
          selectedClasses={selectedClasses}
          onAddClass={handleAddClass}
          onRemoveClass={handleRemoveClass}
        />
      ) : (
        <Settings 
          onFontSizeChange={updateFontSize} 
          onTextColorChange={updateTextColor}
          onTextAlignChange={updateTextAlign}
          onBackgroundColorChange={updateBackgroundColor}
          onBorderRadiusChange={updateBorderRadius}
          onPaddingChange={updatePadding}
          onMarginChange={updateMargin}
          selectedClasses={selectedClasses}
          onAddClass={handleAddClass}
          onRemoveClass={handleRemoveClass}
        />
      )
    )}
    </div>
    
  )
}

export default Design