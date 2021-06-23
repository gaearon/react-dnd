import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { Box } from "./Box";
import update from "immutability-helper";
//import { FileInput } from "./FileInput";

const styles = {
  width: 400,
  height: 600,
  border: "1px solid black",
  position: "relative"
};
export const Container = ({ hideSourceOnDrag }) => {
  const [boxes, setBoxes] = useState({
    a: { top: 10, left: 100, title: "디자인 제한 영역" }
  });
  const [isDraggable, setIsDraggable] = useState(false);
  //setIsDraggable(true);
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top }
          }
        })
      );
    },
    [boxes, setBoxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      }
    }),
    [moveBox]
  );

  const FileInput = () => {
    const handleFileChange = () => {
      setIsDraggable(true);
    };
    return (
      <div class="filebox">
        <label for="ex_file">상품사진 선택</label>
        <input type="file" id="ex_file" onChange={handleFileChange} />
      </div>
    );
  };

  return (
    <div ref={drop} id="container" style={styles}>
      {isDraggable ? null : <FileInput />}
      {isDraggable &&
        Object.keys(boxes).map((key) => {
          const { left, top, title } = boxes[key];
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
            >
              {title}
            </Box>
          );
        })}
    </div>
  );
};
