import { Flex ,Stack, Image} from '@chakra-ui/react';
import React from 'react';

// type ThumbnailProps = {
    
// };

//
// single manga item from mangadupdatexs mainly image and link
const Thumbnail:React.FC = () => {
    const prop = {
		"mangaId": 60235855691,
		"title": "Savage Hero",
		"imageURL": "https://cdn.mangaupdates.com/image/i461057.jpg",
		"link": "https://www.mangaupdates.com/series/ro6vfpn/savage-hero"
	}
    return (
        <Flex
        border= '1px solid'
        bg = 'white'
        >
            <Stack spacing={1}
            direction={'row'}
            align={'center'}
            >
                {prop.imageURL && <Image
                    src={prop.imageURL}
                    alt= "something"
                    borderRadius={'full'}
                    boxSize={'18px'}
                    mr={2}
                />
                }

            </Stack>
        </Flex>
    )
}
export default Thumbnail;