import {Input, } from '@chakra-ui/react'
import React ,{useState} from 'react'
import API from '@/api/API'



// type SearchProps = {
    
// };

const Search:React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")
    //onsubmit probably should be handed from parent. requesting data onhome page about manga
    const onSubmit = async (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        const res =await API.searchMangaUpdates(searchTerm)
        console.log(res)
    }
    const onChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setSearchTerm(event.target.value)
    }

    return (<form
    onSubmit={onSubmit}>
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