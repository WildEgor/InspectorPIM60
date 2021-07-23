import React from 'react'
import Image, { ImageProps } from 'material-ui-image'

const StyledImage = (props: ImageProps) => {
    return (
      <Image
        {...props}
      />
    );
}

export default StyledImage;