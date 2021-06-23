import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
const style = {
  position: "absolute",
  border: "1px dashed red",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
  color: "red"
};
export const Box = ({
  id,
  width = 150,
  height = 150,
  left,
  top,
  hideSourceOnDrag,
  children
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [id, left, top]
  );
  if (isDragging && hideSourceOnDrag) {
    //return <div ref={drag} />;
  }
  return (
    <div ref={drag} style={{ ...style, left, top, width, height }} role="Box">
      {children}
    </div>
  );
};
