import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ViewCodeBlock = ({children, code, getCode}:any) => {
    const [currentCode, setCurrentCode] = React.useState(code || '');
    
    const handleOpen = () => {
        // Get the latest code when dialog opens
        if (getCode) {
            setCurrentCode(getCode());
        }
    };
    
    const handleCopy=async()=>{
        await navigator.clipboard.writeText(currentCode);
        toast.success("Code copied to clipboard!");
    }
    
    return (
        <Dialog onOpenChange={(open) => open && handleOpen()}>
            <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="min-w-5xl max-h-[80vh] overflow-auto">
        <DialogHeader>
        <DialogTitle><div className='flex gap-10'><span className='mt-2'>Source Code </span><Button className='h-10 w-10' onClick={handleCopy}><Copy /></Button></div></DialogTitle>
        <DialogDescription asChild>
            <div>
                <SyntaxHighlighter language="html" style={atomDark} wrapLongLines={true}>
                    {currentCode}
                </SyntaxHighlighter>
            </div>
        </DialogDescription>
        </DialogHeader>
    </DialogContent>
    </Dialog>
  )
}

export default ViewCodeBlock