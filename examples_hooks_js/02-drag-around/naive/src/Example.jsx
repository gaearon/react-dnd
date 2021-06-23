import { useState, useCallback } from "react";
import { Container } from "./Container";
export const Example = () => {
  const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true);
  const toggle = useCallback(() => setHideSourceOnDrag(!hideSourceOnDrag), [
    hideSourceOnDrag
  ]);
  return (
    <div>
      <Container hideSourceOnDrag={hideSourceOnDrag} />
      <p>
        <label htmlFor="hideSourceOnDrag">
          <input
            id="hideSourceOnDrag"
            type="checkbox"
            role="checkbox"
            checked={hideSourceOnDrag}
            onChange={toggle}
          />
          <small>Hide the source item while dragging</small>
        </label>
      </p>
    </div>
  );
};
