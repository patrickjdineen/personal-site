import PhotoViewer from "./PhotoViewer";

export default function PhotoModal({ photo, srcs, displayDate, prev, next }) {
  return (
    <PhotoViewer
      photo={photo}
      srcs={srcs}
      displayDate={displayDate}
      prev={prev}
      next={next}
      isModal
    />
  );
}
