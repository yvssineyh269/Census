import { CloudUpload, ImageIcon, Loader, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

// 1.
export function ImageRenderEmptyState({
  isDragActive,
}: {
  isDragActive: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-primary-gradient mb-4">
        <CloudUpload
          className={cn("size-10 mx-auto mb-3", isDragActive && "text-white")}
        />
      </div>

      <p className="text-base font-semibold text-foreground">
        Déposez l'image du produit ici ou bien{" "}
        <span className="bg-clip-text text-transparent bg-primary-gradient cursor-pointer">
          Cliquez pour importer l'image du produit
        </span>
      </p>

      <Button className="mt-4 bg-primary-gradient" type="button">
        Séléctionner une image
      </Button>
    </div>
  );
}

// 2.
export function ImageRenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive mb-4">
        <ImageIcon className="size-10 mx-auto mb-3" />
      </div>

      <p className="text-base font-semibold">Importation échouée</p>
      <p className="text-xs text-muted-foreground">
        Une erreur s'est produite lors de l'importation
      </p>

      <Button className="mt-4 bg-blend-saturation" type="button">
        Veuillez réessayer
      </Button>
    </div>
  );
}

// 3.
export function ImageRenderUploadedState({
  previewUrl,
  isDeleting,
  handRemoveImage,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handRemoveImage: () => void;
}) {
  return (
    <div>
      <Image src={previewUrl} alt="image" fill className="object-contain p-2" />

      <Button
        variant={"destructive"}
        size={"icon"}
        onClick={handRemoveImage}
        disabled={isDeleting}
        className={cn("absolute top-4 right-4")}
      >
        {isDeleting ? (
          <>
            <Loader className="animate-spin size-5" />
          </>
        ) : (
          <>
            <XIcon className="size-5" />
          </>
        )}
      </Button>
    </div>
  );
}

// 4.
export function ImageRenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <>{progress}%</>
      <p className="mt-2 text-sm text-muted-foreground">Importation...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
