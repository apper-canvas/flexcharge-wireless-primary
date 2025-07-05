import { useState } from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ onSearch, placeholder = "Search...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }
  
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      icon="Search"
      className={className}
    />
  )
}

export default SearchBar