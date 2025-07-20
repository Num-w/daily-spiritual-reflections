import React, { useState, useRef, useEffect } from 'react';
import { Type, Palette, Underline, Bold, Italic, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  darkMode: boolean;
  className?: string;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Écrivez votre texte...", 
  rows = 4,
  darkMode,
  className = ""
}: RichTextEditorProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    { name: 'Rouge', value: '#dc2626', class: 'text-red-600' },
    { name: 'Bleu', value: '#2563eb', class: 'text-blue-600' },
    { name: 'Vert', value: '#16a34a', class: 'text-green-600' },
    { name: 'Violet', value: '#9333ea', class: 'text-purple-600' },
    { name: 'Orange', value: '#ea580c', class: 'text-orange-600' },
    { name: 'Rose', value: '#e11d48', class: 'text-pink-600' },
    { name: 'Indigo', value: '#4f46e5', class: 'text-indigo-600' },
    { name: 'Jaune', value: '#ca8a04', class: 'text-yellow-600' }
  ];

  const highlightColors = [
    { name: 'Jaune', value: '#fef08a', class: 'bg-yellow-200' },
    { name: 'Vert', value: '#bbf7d0', class: 'bg-green-200' },
    { name: 'Bleu', value: '#bfdbfe', class: 'bg-blue-200' },
    { name: 'Rose', value: '#fce7f3', class: 'bg-pink-200' },
    { name: 'Violet', value: '#e9d5ff', class: 'bg-purple-200' },
    { name: 'Orange', value: '#fed7aa', class: 'bg-orange-200' },
    { name: 'Rouge', value: '#fecaca', class: 'bg-red-200' },
    { name: 'Gris', value: '#f3f4f6', class: 'bg-gray-200' }
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
      setShowColorPicker(false);
      setShowHighlightPicker(false);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyColor = (color: string) => {
    applyFormat('foreColor', color);
    setShowColorPicker(false);
  };

  const applyHighlight = (color: string) => {
    applyFormat('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  const clearFormatting = () => {
    applyFormat('removeFormat');
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${className}`}>
      {/* Toolbar */}
      <div className={`flex items-center space-x-2 p-2 border-b ${
        darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-2" />

        {/* Color Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (selectedText) {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }
            }}
            disabled={!selectedText}
            className="h-8 w-8 p-0"
          >
            <Type className="w-4 h-4" />
          </Button>
          
          {showColorPicker && (
            <div className={`absolute top-10 left-0 z-50 p-3 rounded-lg shadow-lg border ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => applyColor(color.value)}
                    className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (selectedText) {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }
            }}
            disabled={!selectedText}
            className="h-8 w-8 p-0"
          >
            <Palette className="w-4 h-4" />
          </Button>
          
          {showHighlightPicker && (
            <div className={`absolute top-10 left-0 z-50 p-3 rounded-lg shadow-lg border ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-4 gap-2">
                {highlightColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => applyHighlight(color.value)}
                    className="w-8 h-8 rounded-full hover:scale-110 transition-transform border"
                    style={{ backgroundColor: color.value }}
                    title={`Surligner en ${color.name}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFormatting}
          className="h-8 w-8 p-0"
          title="Effacer le formatage"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {selectedText && (
          <span className="text-xs text-gray-500 ml-2">
            "{selectedText.substring(0, 20)}{selectedText.length > 20 ? '...' : ''}" sélectionné
          </span>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        className={`min-h-[${rows * 1.5}rem] p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
          darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
        }`}
        style={{ minHeight: `${rows * 1.5}rem` }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
          }
        `
      }} />
    </div>
  );
};