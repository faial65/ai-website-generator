import { SwatchBook, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Props = {
  onFontSizeChange: (fontSize: string) => void
  onTextColorChange: (color: string) => void
  onTextAlignChange: (align: string) => void
  onBackgroundColorChange: (color: string) => void
  onBorderRadiusChange: (radius: string) => void
  onPaddingChange: (padding: string) => void
  onMarginChange: (margin: string) => void
  selectedClasses: string[]
  onAddClass: (className: string) => void
  onRemoveClass: (className: string) => void
}

const Settings = ({ 
  onFontSizeChange, 
  onTextColorChange, 
  onTextAlignChange,
  onBackgroundColorChange,
  onBorderRadiusChange,
  onPaddingChange,
  onMarginChange,
  selectedClasses,
  onAddClass,
  onRemoveClass
}: Props) => {
  const [align, setAlign] = useState<string>('left')
  const [newClass, setNewClass] = useState('')

  const handleAlignmentChange = (value: string) => {
    setAlign(value)
    onTextAlignChange(value)
  }

  const addClass = () => {
    if (newClass.trim()) {
      onAddClass(newClass.trim())
      setNewClass('')
    }
  }

  return (
    <div className='w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2'>
      <h2 className='flex gap-2 items-center font-bold'>
        <SwatchBook /> Settings
      </h2>

      {/* Font Size + Text Color inline */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className='text-sm'>Font Size</label>
          <Select onValueChange={onFontSizeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((_, index) => (
                <SelectItem value={`${index + 12}`} key={index}>
                  {index + 12}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm block'>Text Color</label>
          <input type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1 cursor-pointer'
            defaultValue="#000000"
            onChange={(event) => onTextColorChange(event.target.value)}
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={handleAlignmentChange}
          className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
        >
          <ToggleGroupItem value="left" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignLeft size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignCenter size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignRight size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Background Color + Border Radius inline */}
      <div className="flex items-center gap-4">
        <div>
          <label className='text-sm block'>Background</label>
          <input type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1 cursor-pointer'
            defaultValue="#ffffff"
            onChange={(event) => onBackgroundColorChange(event.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className='text-sm'>Border Radius</label>
          <Input type='text'
            placeholder='e.g. 8px'
            onChange={(e) => onBorderRadiusChange(e.target.value)}
            className='mt-1'
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className='text-sm'>Padding</label>
        <Input type='text'
          placeholder='e.g. 10px 15px'
          onChange={(e) => onPaddingChange(e.target.value)}
          className='mt-1'
        />
      </div>

      {/* Margin */}
      <div>
        <label className='text-sm'>Margin</label>
        <Input type='text'
          placeholder='e.g. 10px 15px'
          onChange={(e) => onMarginChange(e.target.value)}
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
  )
}

export default Settings