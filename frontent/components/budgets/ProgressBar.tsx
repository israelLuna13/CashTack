"use client"
import { CircularProgressbar,buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export default function ProgressBar({porcentage}:{porcentage:number}) {
  return (
    <div className="flex justify-center p-10">
      <CircularProgressbar
        styles={buildStyles({
          pathColor: porcentage > 100 ? "#DC2626" : "#F59E0B",
          trailColor: "#E1E1E1",
          textColor: porcentage > 100 ? "#DC2626" : "#F59E0B",
          textSize: 8,
        })}
        text={`${porcentage}%: Spent `}
        value={porcentage}
      />
    </div>
  );
}
