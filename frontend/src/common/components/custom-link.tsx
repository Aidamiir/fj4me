import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import { forwardRef } from 'react';

export type CustomLinkProps = MuiLinkProps & NextLinkProps;

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>((props, ref) => {
    const { href, ...other } = props;
    return (
        <MuiLink component={NextLink} href={href} ref={ref} {...other} />
    );
});

CustomLink.displayName = 'CustomLink';
