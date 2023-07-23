import Image from "next/image";

function ImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem] not-prose mb-4">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}

export default ImageRenderer;
