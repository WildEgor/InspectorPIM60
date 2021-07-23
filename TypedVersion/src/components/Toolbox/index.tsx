import React from "react";
import PaperContainer from "../PaperContainer";

// import StyledImage from "../atoms/StyledImage";
// import StyledBadge from "../atoms/StyledBadge";
interface Props {
    isRunning?: boolean
}

export default function Toolbox(props: Props) {
    const { 
        // isRunning = true
    } = props;

    return(
        <PaperContainer width={300}></PaperContainer>
    );
}