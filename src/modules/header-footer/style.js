import styled from '@emotion/styled';

import { Drawer } from '@mantine/core';

export const StyledDrawer = styled(Drawer)`
    .mantine-Drawer-content {
        --top-offset: 32px;
        max-height: calc(100% - var(--top-offset)) !important;
        margin-top: var(--top-offset) !important;
    }
`;