import { Plane } from "@react-three/drei";
import { useControls } from "leva";

export default function FloorComponent() {
	const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor } =
		useControls(
			"Floor",
			{
				topLeftColor: "#a2ebd7",
				topRightColor: "#fceca5",
				bottomLeftColor: "#a69eef",
				bottomRightColor: "#ef9ad8",
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
