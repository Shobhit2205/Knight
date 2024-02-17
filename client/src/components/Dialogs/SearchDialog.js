import React, { useState } from 'react'
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Skeleton, Slide, Stack } from '@mui/material'
import axios from 'axios';
import { MagnifyingGlass } from 'phosphor-react';
import { useSnack } from '../../Context/SnackBar';
import { Search, SearchIconWrapper, StyledInputBase } from '../Search';
import SearchElement from '../SearchElement';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SearchModal = ({open, handleClose}) => {
  const [search, setSearch] = useState();
  const [snack, setSnack] = useSnack();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchResult = async (e) => {   
    try {
      if((e.key === 'Enter' || e.type === 'click') && search.length > 0){
        setLoading(true);
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/search?search=${search}`);
        setSearchResult(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setSnack({
        ...snack,
        severity: "error",
        message: error?.response?.data?.message
      })
    }
  }

  return (
    <>
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        
      >
        <DialogTitle sx={{ backgroundColor: "#F8FAFF"}}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "Search" }}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => handleSearchResult(e)}
            />
            <Button onClick={(e) => handleSearchResult(e)}>Search</Button>
          </Search>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {loading ? <Stack spacing={2}>
                <Skeleton variant="rounded" width="100%" height={60} /> 
                <Skeleton variant="rounded" width="100%" height={60} /> 
                <Skeleton variant="rounded" width="100%" height={60} /> 
               </Stack>: searchResult.map((el, ind) => (
                 <Stack key={ind}>
                   <SearchElement el={el} handleClose={handleClose} open={open} />
                 </Stack>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchModal