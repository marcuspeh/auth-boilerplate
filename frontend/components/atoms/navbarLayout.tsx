import { styled, useTheme } from '@mui/material/styles'
import { Box, CssBaseline, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { Menu, ChevronLeft, ChevronRight, FormatListBulleted, Add, Logout } from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { logoutUser } from '../../services/api/userController'
import Router from 'next/router'
import TodoCard from '../viewTodo/todoCard'
import { ViewType } from '../../models/viewType'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

interface Props {
    title: string
    reactElement: ReactNode
}

const logoutClick = async () => {
  const data = await logoutUser()
  if (data.isSuccess) {
    Router.push("/login")
  } else {
    alert("Please try again")
  }
}

const NavbarLayout: React.FC<Props> = (props): JSX.Element => {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const { title, reactElement, ...rest } = props        

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }
    
    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                {title}
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
            <IconButton onClick={handleDrawerClose} sx={{ my: 0}}>
                {theme.direction === 'ltr' ? <><span>Todo Manager</span><ChevronLeft /></> : <ChevronRight />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem key={"View todo"} disablePadding>
                <ListItemButton href={"/"}>
                    <ListItemIcon>
                    <FormatListBulleted />
                    </ListItemIcon>
                    <ListItemText primary={"View todo"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"Create new"} disablePadding>
                <ListItemButton href={"/new"}>
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText primary={"Create New"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"logout"} disablePadding>
                <ListItemButton onClick={logoutClick}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary={"Log out"} />
                </ListItemButton>
              </ListItem>
            </List>
        </Drawer>
        <Main open={open}>
            <DrawerHeader />
            {reactElement}
        </Main>
        </Box>
    )
}

export default NavbarLayout