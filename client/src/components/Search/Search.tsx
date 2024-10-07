import {Flex, Input, InputGroup} from '@chakra-ui/react'
import React ,{useState} from 'react'



// type SearchProps = {
    
// };

const Search:React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setSearchTerm(event.target.value)
    }

    return (<form>
        <Input
            required
            name = "search"
            placeholder='search'
            onChange={onChange}
            fontSize = '10pt'
            _placeholder={{color:"gray.500"}}
            _hover={{border:"1px solid" , borderColor:"red.500"}}
        />
   
    </form>)
}
export default Search;