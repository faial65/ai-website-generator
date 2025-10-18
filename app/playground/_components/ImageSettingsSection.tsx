"use client";
import React, { useRef, useState } from "react";
import {
    Image as ImageIcon,
    Crop,
    Expand,
    Image as ImageUpscale, // no lucide-react upscale, using Image icon
    ImageMinus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

type Props = {
    onImageSrcChange: (src: string) => void
    onImageAltChange: (alt: string) => void
    onImageWidthChange: (width: string) => void
    onImageHeightChange: (height: string) => void
    onBorderRadiusChange: (radius: string) => void
    onMarginChange: (margin: string) => void
    onPaddingChange: (padding: string) => void
    selectedClasses: string[]
    onAddClass: (className: string) => void
    onRemoveClass: (className: string) => void
};

const transformOptions = [
    { label: "Smart Crop", value: "smartcrop", icon: <Crop /> },
    { label: "Resize", value: "resize", icon: <Expand /> },
    { label: "Upscale", value: "upscale", icon: <ImageUpscale /> },
    { label: "BG Remove", value: "bgremove", icon: <ImageMinus /> },
];

function ImageSettingSection({ 
    onImageSrcChange,
    onImageAltChange,
    onImageWidthChange,
    onImageHeightChange,
    onBorderRadiusChange,
    onMarginChange,
    onPaddingChange,
    selectedClasses,
    onAddClass,
    onRemoveClass
}: Props) {
    const [altText, setAltText] = useState("");
    const [width, setWidth] = useState<string>("300px");
    const [height, setHeight] = useState<string>("200px");
    const [borderRadius, setBorderRadius] = useState("0px");
    const [margin, setMargin] = useState("");
    const [padding, setPadding] = useState("");
    const [preview, setPreview] = useState("");
    const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
    const [newClass, setNewClass] = useState('');
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [transforming, setTransforming] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Apply AI Transform
    const applyTransform = async (transformType: string) => {
        if (!currentImageUrl && !preview) {
            alert('Please upload or generate an image first');
            return;
        }

        try {
            setTransforming(true);
            const imageToTransform = currentImageUrl || preview;

            const response = await fetch('/api/imagekit/transform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: imageToTransform,
                    transformType: transformType,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPreview(data.url);
                setCurrentImageUrl(data.url);
                onImageSrcChange(data.url);
                console.log('Transform applied:', transformType, data.url);
                
                // Toggle the transform as active
                setActiveTransforms((prev) =>
                    prev.includes(transformType)
                        ? prev.filter((t) => t !== transformType)
                        : [...prev, transformType]
                );
            } else {
                alert('Transform failed: ' + data.error);
            }
        } catch (error) {
            console.error('Transform error:', error);
            alert('Transform failed. Please try again.');
        } finally {
            setTransforming(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to ImageKit
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);

            const response = await fetch('/api/imagekit/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                // Use the ImageKit URL
                setCurrentImageUrl(data.url);
                onImageSrcChange(data.url);
                setPreview(data.url);
                console.log('Image uploaded to ImageKit:', data.url);
            } else {
                console.error('Upload failed:', data.error);
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Generate AI Image
    const generateAIImage = async () => {
        if (!altText.trim()) {
            alert('Please enter a prompt in the Alt Text field');
            return;
        }

        try {
            setGenerating(true);

            const response = await fetch('/api/imagekit/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: altText,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPreview(data.url);
                setCurrentImageUrl(data.url);
                onImageSrcChange(data.url);
                console.log('AI Image generated:', data.url);
            } else {
                alert('Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('Generation failed. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    // Upload current preview to ImageKit and website
    const uploadCurrentImage = async () => {
        if (!preview && !currentImageUrl) {
            // If no image, open file dialog
            openFileDialog();
            return;
        }

        // If already an ImageKit URL, just apply it
        if (currentImageUrl && currentImageUrl.includes('ik.imagekit.io')) {
            onImageSrcChange(currentImageUrl);
            console.log('Using existing ImageKit URL:', currentImageUrl);
            return;
        }

        // If it's a generated or external URL, fetch and upload to ImageKit
        if (preview && !preview.startsWith('data:')) {
            try {
                setUploading(true);

                // Fetch the image
                const response = await fetch(preview);
                const blob = await response.blob();
                
                // Create a file from the blob
                const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' });

                // Upload to ImageKit
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileName', file.name);

                const uploadResponse = await fetch('/api/imagekit/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await uploadResponse.json();

                if (data.success) {
                    setCurrentImageUrl(data.url);
                    onImageSrcChange(data.url);
                    setPreview(data.url);
                    console.log('Image uploaded to ImageKit:', data.url);
                } else {
                    alert('Upload failed: ' + data.error);
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Upload failed. Please try again.');
            } finally {
                setUploading(false);
            }
        } else {
            // If it's a base64, trigger file upload
            openFileDialog();
        }
    };

    const addClass = () => {
        if (newClass.trim()) {
            onAddClass(newClass.trim());
            setNewClass('');
        }
    };

    return (
        <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2">
            <h2 className="flex gap-2 items-center font-bold">
                <ImageIcon /> Image Settings
            </h2>

            {/* Preview (clickable) */}
            {preview && (
                <div className="flex justify-center">
                    <img
                        src={preview}
                        alt={altText}
                        className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
                        onClick={openFileDialog}
                    />
                </div>
            )}

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={uploadCurrentImage}
                disabled={uploading}
            >
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    preview || currentImageUrl ? 'Upload to Website & ImageKit' : 'Upload Image'
                )}
            </Button>

            {/* Alt text */}
            <div>
                <label className="text-sm">Prompt / Alt Text</label>
                <Input
                    type="text"
                    value={altText}
                    onChange={(e) => {
                        setAltText(e.target.value);
                        onImageAltChange(e.target.value);
                    }}
                    placeholder="Enter alt text"
                    className="mt-1"
                />
            </div>

            <Button 
                className="w-full"
                onClick={generateAIImage}
                disabled={generating || !altText.trim()}
            >
                {generating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    'Generate AI Image'
                )}
            </Button>

            {/* Transform Buttons */}
            <div>
                <label className="text-sm mb-1 block">AI Transform</label>
                <div className="flex gap-2 flex-wrap">
                    <TooltipProvider>
                        {transformOptions.map((opt) => {
                            const applied = activeTransforms.includes(opt.value);
                            return (
                                <Tooltip key={opt.value}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={applied ? "default" : "outline"}
                                            className="flex items-center justify-center p-2"
                                            onClick={() => applyTransform(opt.value)}
                                            disabled={transforming || (!preview && !currentImageUrl)}
                                        >
                                            {transforming ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                opt.icon
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {opt.label} {applied && "(Applied)"}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </div>
            </div>

            {/* Width and Height */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-sm">Width</label>
                    <Input
                        type="text"
                        value={width}
                        onChange={(e) => {
                            setWidth(e.target.value);
                            onImageWidthChange(e.target.value);
                        }}
                        placeholder="e.g. 100% or 300px"
                        className="mt-1"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm">Height</label>
                    <Input
                        type="text"
                        value={height}
                        onChange={(e) => {
                            setHeight(e.target.value);
                            onImageHeightChange(e.target.value);
                        }}
                        placeholder="e.g. auto or 200px"
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Border Radius */}
            <div>
                <label className="text-sm">Border Radius</label>
                <Input
                    type="text"
                    value={borderRadius}
                    onChange={(e) => {
                        setBorderRadius(e.target.value);
                        onBorderRadiusChange(e.target.value);
                    }}
                    placeholder="e.g. 8px or 50%"
                    className="mt-1"
                />
            </div>

            {/* Margin */}
            <div>
                <label className='text-sm'>Margin</label>
                <Input 
                    type='text'
                    value={margin}
                    placeholder='e.g. 10px 15px'
                    onChange={(e) => {
                        setMargin(e.target.value);
                        onMarginChange(e.target.value);
                    }}
                    className='mt-1'
                />
            </div>

            {/* Padding */}
            <div>
                <label className='text-sm'>Padding</label>
                <Input 
                    type='text'
                    value={padding}
                    placeholder='e.g. 10px 15px'
                    onChange={(e) => {
                        setPadding(e.target.value);
                        onPaddingChange(e.target.value);
                    }}
                    className='mt-1'
                />
            </div>

            {/* Class Manager */}
            <div>
                <label className="text-sm font-medium">Classes</label>

                {/* Existing classes as removable chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClasses.length > 0 ? (
                        selectedClasses.map((cls) => (
                            <span
                                key={cls}
                                className="flex text-xs items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border"
                            >
                                {cls}
                                <button
                                    onClick={() => onRemoveClass(cls)}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">No classes applied</span>
                    )}
                </div>

                {/* Add new class input */}
                <div className="flex gap-2 mt-3">
                    <Input
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        placeholder="Add class..."
                        onKeyDown={(e) => e.key === 'Enter' && addClass()}
                    />
                    <Button type="button" onClick={addClass}>
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ImageSettingSection;