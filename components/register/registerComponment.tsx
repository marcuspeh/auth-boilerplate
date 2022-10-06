import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import  RegisterForm   from './registerForm'



export default function RegisterComponment() {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
            sx={{
                my: 8,
                mx: 2
            }}
            >
            <Typography variant="h4" sx={{ fontWeight: '700' }}> 
                Todo Manager
            </Typography>
            <  RegisterForm   />
            <Typography variant="body2">
                Already have an account? {" "}
                <Link href="/login" variant="body2">
                    Sign In
                </Link>
            </Typography>
            </Box>
        </Grid>
        
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        />
    </Grid>
  )
}
