import React from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

interface CarouselImage {
    src: string, // required
    srcset?: string, // `https://placedog.net/400/240?id=1 400w, https://placedog.net/700/420?id=1 700w, https://placedog.net/1000/600?id=1 1000w`,
    sizes?: string, // '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
    alt?: string,
    thumbnail?: string 
}

interface Props {
    updateRecipe: (id: number) => Promise<string>;
    getCurrentRecipe: () => Promise<number>;
    getCountRecipe: () => Promise<number>
}

export default function ReferenceImageBox(props: Props) {
    return(
        <div></div>
    )
}