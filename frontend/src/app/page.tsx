// src/app/page.tsx
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { ThemeToggle } from '@/components/theme';
import { LogoutButton } from '@/app/auth/_ui';

export default function HomePage() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Верхняя панель с кнопками (например, Logout, смена темы) */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Портал возможностей
                </Typography>
                <Box sx={{ display: 'flex', gap: '16px' }}>
                    <ThemeToggle />
                    <LogoutButton />
                </Box>
            </Box>

            {/* Hero блок с поисковой строкой */}
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }} elevation={3}>
                <Typography variant="h5" mb={2}>
                    Найди работу, практику или стажировку своей мечты
                </Typography>
                {/* Здесь можно добавить форму поиска */}
                <Box component="form" noValidate sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <input
                        type="text"
                        placeholder="Ключевые слова..."
                        style={{ padding: '8px', fontSize: '16px', width: '300px' }}
                    />
                    <Button variant="contained" color="primary">
                        Найти
                    </Button>
                </Box>
            </Paper>

            {/* Блок категорий/фильтров */}
            <Box mb={4}>
                <Typography variant="h6" mb={2}>
                    Категории вакансий
                </Typography>
                <Grid container spacing={2}>
                    {['Стажировки', 'Практика', 'Первая работа', 'Постоянная занятость'].map((category) => (
                        <Grid item xs={6} md={3} key={category}>
                            <Paper sx={{ p: 2, textAlign: 'center' }} elevation={2}>
                                <Typography>{category}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Рекомендованные вакансии */}
            <Box mb={4}>
                <Typography variant="h6" mb={2}>
                    Рекомендованные вакансии
                </Typography>
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} md={6} key={item}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle1">Вакансия #{item}</Typography>
                                <Typography variant="body2">
                                    Краткое описание вакансии. Здесь можно отобразить ключевую информацию.
                                </Typography>
                                <Button size="small" sx={{ mt: 1 }}>
                                    Подробнее
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Блок историй успеха */}
            <Box mb={4}>
                <Typography variant="h6" mb={2}>
                    Истории успеха
                </Typography>
                <Grid container spacing={2}>
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} md={4} key={item}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle1">История #{item}</Typography>
                                <Typography variant="body2">
                                    "Я нашёл свою первую работу благодаря этому сервису!" – пример отзыва.
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Блок для работодателей */}
            <Box mb={4}>
                <Paper sx={{ p: 4, textAlign: 'center' }} elevation={3}>
                    <Typography variant="h6" mb={2}>
                        Для работодателей
                    </Typography>
                    <Typography variant="body2" mb={2}>
                        Размещайте вакансии и находите лучших кандидатов.
                    </Typography>
                    <Button variant="outlined">Разместить вакансию</Button>
                </Paper>
            </Box>
        </Container>
    );
}