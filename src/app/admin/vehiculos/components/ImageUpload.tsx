'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { uploadImage, deleteImage } from '@/services/vehicleService';
import { toast } from "sonner";

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
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      console.log('Archivos recibidos para carga:', acceptedFiles.map(f => `${f.name} (${f.size} bytes)`));
      
      // Procesar las imágenes una por una para mejor diagnóstico
      const urls: string[] = [];
      for (const file of acceptedFiles) {
        try {
          console.log(`Procesando archivo: ${file.name}`);
          const url = await uploadImage(file);
          urls.push(url);
          console.log(`Archivo ${file.name} subido exitosamente`);
        } catch (error: any) {
          console.error(`Error al subir ${file.name}:`, error);
          toast.error(`Error al subir ${file.name}: ${error.message || 'Error desconocido'}`);
        }
      }
      
      if (urls.length > 0) {
        onChange([...value, ...urls]);
        toast.success(`${urls.length} de ${acceptedFiles.length} imágenes subidas correctamente`);
      }
    } catch (error: any) {
      console.error('Error en el proceso general de carga:', error);
      toast.error(`Error al procesar las imágenes: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const handleDelete = async (url: string, index: number) => {
    try {
      // Primero eliminamos la imagen del array local
      const newUrls = [...value];
      newUrls.splice(index, 1);
      onChange(newUrls);
      
      // Luego intentamos eliminarla del storage
      await deleteImage(url);
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      toast.error('No se pudo eliminar la imagen del servidor');
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-2">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="mt-2 text-sm text-muted-foreground">Subiendo imágenes...</p>
          </div>
        ) : (
          <>
        <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Suelta las imágenes aquí"
            : "Arrastra imágenes aquí o haz clic para seleccionar"}
        </p>
          </>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable 
          droppableId="droppable-images" 
          direction="horizontal"
          isDropDisabled={false}
          isCombineEnabled={false}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
            >
              {value.map((url, index) => (
                <Draggable 
                  key={url} 
                  draggableId={url} 
                  index={index}
                  isDragDisabled={isUploading}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative aspect-square rounded-lg overflow-hidden group border"
                    >
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(url, index);
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full"
                          type="button"
                        >
                          <X className="h-4 w-4 text-red-500" />
                      </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <p className="mt-2 text-xs text-muted-foreground">
        La primera imagen será la principal. Arrastra para reordenar.
      </p>
    </div>
  );
} 