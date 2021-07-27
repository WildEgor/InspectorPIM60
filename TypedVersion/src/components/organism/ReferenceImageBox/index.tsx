import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import LoaderContainer from "../../molecules/LoaderContainer";
import PaperContainer from '../../molecules/PaperContainer';
import StyledSelector from '../../atoms/StyledSelector';
import StyledInput from '../../atoms/StyledInput';
interface CarouselImage {
    src: string, // required
    srcset?: string, // `https://placedog.net/400/240?id=1 400w, https://placedog.net/700/420?id=1 700w, https://placedog.net/1000/600?id=1 1000w`,
    sizes?: string, // '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
    alt?: string,
    thumbnail?: string 
}

interface Props {
    width: number,
    height: number,
    getRecipeImage: (id: number) => Promise<string>
    getActiveRecipeImage: () => Promise<string>
    getRecipesNames: () => Promise<string[]>
    updateRecipe: (id: number) => Promise<any>;
    getActiveRecipeNumber: () => Promise<number>;
    getRecipes: () => Promise<number>
    needUpdate?: boolean;
}

type RecipeVariant = {
    image: CarouselImage,
    id: number, 
    name: string,
    isActive: boolean,
}

export default function ReferenceImageBox(props: Props) {
    const { width, height, updateRecipe, getActiveRecipeNumber, getRecipes, getRecipeImage, needUpdate, getActiveRecipeImage, getRecipesNames } = props;

    const [recipeImages, setRecipeImages] = useState<RecipeVariant[]>([{ image: { src: '' }, id: 0, name: 'Recipe 1', isActive: false}]);
    const [selectorValue, setSelectorValue] = useState<number>(0);

    async function getImages() {
        const currentReferenceNumber = await getActiveRecipeNumber();

        if (currentReferenceNumber) {
            const recipeCount = await getRecipes();
            const recipeNames = await getRecipesNames();
            if (recipeCount && recipeNames) {
                const recipeImages = await Promise.all(Array.from({ length: recipeCount }, (_v , k)=> {
                    if (k !== currentReferenceNumber) return getActiveRecipeImage()
                    return getRecipeImage(k)
                }))

                // TODO: cast string image
                const recipes: RecipeVariant[] = recipeImages.map((item, id) => {return { image: { src: item }, id, name: `${recipeNames[id]}`, isActive: (id === currentReferenceNumber? true : false)}})
                setRecipeImages(recipes);
            }
        } else {
            throw new Error('Error when get reference');
        }
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectorValue(event.target.value as number);
    };

    return(
        <PaperContainer width={width}>
            <LoaderContainer updateData={getImages} needUpdate={needUpdate} >
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Carousel images={recipeImages.map(recipe => recipe.image)} style={{ height: height, width: width }} />
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel id="demo-customized-select-label">Age</InputLabel>
                            <StyledSelector
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={selectorValue}
                                onChange={handleChange}
                                input={<StyledInput />}
                            />
                            {recipeImages.map((recipe, id) => <MenuItem key={recipe.name + recipe.id} value={recipe.id}>{recipe.name}</MenuItem>)}
                        </FormControl>
                    </Grid>
                </Grid>
            </LoaderContainer>
        </PaperContainer>
    )
}