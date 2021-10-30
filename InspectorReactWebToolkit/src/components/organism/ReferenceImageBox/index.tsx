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
import StyledButton from '../../atoms/StyledButton';
import Mode from "../../molecules/Mode";
import Typography from '@material-ui/core/Typography';
interface CarouselImage {
    src: string, // required
    srcset?: string, // `https://placedog.net/400/240?id=1 400w, https://placedog.net/700/420?id=1 700w, https://placedog.net/1000/600?id=1 1000w`,
    sizes?: string, // '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
    alt?: string,
    thumbnail?: string 
}

interface Props {
    id?: number,
    width?: number,
    height?: number,
    getRecipeImage: (id: number) => Promise<string>
    getActiveRecipeImage: () => Promise<string>
    getRecipesNames: (count: number) => Promise<string[]>
    updateRecipe: (id: number) => Promise<boolean>;
    getActiveRecipeNumber: () => Promise<number>;
    getRecipes: () => Promise<number>
    getMode: () => Promise<number>;
    setMode: (mode: number) => Promise<boolean>
}

type RecipeVariant = {
    image: CarouselImage, 
    name: string,
    isActive: boolean,
}

export default function ReferenceImageBox(props: Props) {
    const { 
        getMode, 
        setMode, 
        width = 640, 
        height = 480, 
        updateRecipe, 
        getActiveRecipeNumber, 
        getRecipes, 
        getRecipeImage, 
        getActiveRecipeImage, 
        getRecipesNames } = props;

    const [recipeImages, setRecipeImages] = useState<RecipeVariant[]>([{ image: { src: '' }, name: 'Recipe 1', isActive: false }]);
    const [selectorValue, setSelectorValue] = useState<string>('');
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0)
    const [needUpdateData, setNeedUpdateData] = useState<boolean>(false);

    const [errorWhenUpdate, setErrorWhenUpdate] = useState<boolean>(false);

    const getImages = async () => {
        const currentReferenceNumber = await getActiveRecipeNumber();
        const recipeCount = await getRecipes();

        const recipeNames = await getRecipesNames(recipeCount);

        const recipeImages = await Promise.all(Array.from({ length: recipeCount }, (_v , k)=> {
            if (k === currentReferenceNumber) return getActiveRecipeImage()
            return getRecipeImage(k)
        }))

        const recipes: RecipeVariant[] = recipeImages
                                            .map((item, id) => (
                                            { 
                                                image: { src: item }, 
                                                name: `${recipeNames[id]}`, 
                                                isActive: (id === currentReferenceNumber? true : false)
                                            }))
        
        if (!recipes.length) throw new Error('No response')

        setRecipeImages(recipes);
    }

    const updateRecipeOnClick = async () => {
        try {
            await updateRecipe(Number(selectorValue))
            setNeedUpdateData(!needUpdateData)
        } catch (error) {
            setErrorWhenUpdate(true)
        }
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCurrentRecipeIndex(event.target.value as number)
        setSelectorValue(event.target.value as string);
    };

    return(
        <PaperContainer width={width}>
            {setErrorWhenUpdate && <Typography variant='h5'>Recipe Viewer</Typography>}
            <LoaderContainer updateData={() => getImages()} isError={setErrorWhenUpdate} >
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Carousel 
                            thumbnailWidth={'15%'}
                            thumbnailHeight={'15%'}
                            hasMediaButton={false}
                            hasTransition={false}
                            index={currentRecipeIndex} 
                            images={recipeImages.map(recipe => recipe.image)} 
                            style={{ height: height, width: width }} 
                        />
                    </Grid>
                    <Grid item xs>
                        <FormControl>
                            <InputLabel id="demo-customized-select-label">Choose recipe: </InputLabel>
                            <StyledSelector
                                disabled={errorWhenUpdate}
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={selectorValue}
                                onChange={handleChange}
                                input={<StyledInput />}
                            >
                            {recipeImages && recipeImages.map((recipe, id) => <MenuItem key={recipe.name} value={id}>{recipe.name}</MenuItem>)}
                            </StyledSelector>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <StyledButton 
                            disabled={errorWhenUpdate} 
                            variant="outlined" 
                            color="primary" 
                            onClick={updateRecipeOnClick}
                        >Change</StyledButton>
                        <Mode
                            getMode={getMode}
                            setMode={setMode}
                        />
                    </Grid>
                </Grid>
            </LoaderContainer>
        </PaperContainer>
    )
}