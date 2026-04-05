import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ScreenType = 'mobile_vertical' | 'mobile_horizontal' | 'desktop';

export function useDetectScreen(): ScreenType {
    const theme = useTheme();

    const isMobileVertical = useMediaQuery(theme.breakpoints.down('sm'));
    const isMobileHorizontal = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobileVertical) return 'mobile_vertical';
    if (isMobileHorizontal) return 'mobile_horizontal';
    return 'desktop';
}
