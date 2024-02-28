import React from "react";
import ForbiddenImage from "../assets/images/forbidden.jpg";

export default function Forbidden() {
  return (
    <div>
      <img
        src={ForbiddenImage}
        width="50%"
        className="mb-4 mx-auto rounded-full"
        alt="Forbidden"
      />
    </div>
  );
}
