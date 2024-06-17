import { Plane } from "@react-three/drei";
import { useControls } from "leva";

export default function FloorComponent() {
  const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor } =
    useControls(
      "Floor",
      {
        topLeftColor: "#b7d9ff",
        topRightColor: "#a4dffc",
        bottomLeftColor: "#7b98cb",
        bottomRightColor: "#c1c6e8",
      },
      { collapsed: true, color: "#eac9e1" }
    );

  return (
    <Plane args={[2, 2]} frustumCulled={false} matrixAutoUpdate={false}>
      <floorMaterial
        topLeftColor={topLeftColor}
        topRightColor={topRightColor}
        bottomRightColor={bottomRightColor}
        bottomLeftColor={bottomLeftColor}
      />
    </Plane>
  );
}
