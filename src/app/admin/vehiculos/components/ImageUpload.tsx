'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onReorder: (value: string[]) => void;
}

export function ImageUpload({
  value,
  onChange,
  onReorder
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Aquí iría la lógica para subir las imágenes a tu servicio de almacenamiento
    // Por ahora, simularemos URLs locales
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    onChange([...value, ...newUrls]);
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition"
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Suelta las imágenes aquí"
            : "Arrastra imágenes aquí o haz clic para seleccionar"}
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-3 gap-4 mt-4"
            >
              {value.map((url, index) => (
                <Draggable key={url} draggableId={url} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => {
                          const newUrls = [...value];
                          newUrls.splice(index, 1);
                          onChange(newUrls);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 