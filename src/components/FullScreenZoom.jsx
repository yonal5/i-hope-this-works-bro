export default function FullScreenZoom({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose} // click background to close
    >
      <img
        src={image}
        alt="Zoomed Product"
        className="max-h-[95vh] max-w-[95vw] object-contain rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent closing on image click
      />
    </div>
  );
}
