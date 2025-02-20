'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Grid,
    TextField,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Resume {
    id: number;
    title: string;
    description: string;
}

const recommendedResumes: Resume[] = [
    {
        id: 101,
        title: 'Резюме: Junior Frontend Developer',
        description:
            'Опыт работы: стажировки, фриланс-проекты. Навыки: React, JavaScript, CSS. Ищу позицию для развития карьеры в веб-разработке.',
    },
    {
        id: 102,
        title: 'Резюме: Digital Marketer',
        description:
            'Образование в маркетинге, опыт работы с SMM и аналитикой. Ищу возможность работать в динамичной digital-среде.',
    },
    {
        id: 103,
        title: 'Резюме: Graphic Designer',
        description:
            'Креативный дизайнер с опытом работы над рекламными кампаниями и веб-дизайном. Готов к новым проектам.',
    },
    {
        id: 104,
        title: 'Резюме: Backend Developer',
        description:
            'Опыт разработки на Node.js, знание баз данных. Ищу позицию Junior Backend Developer для дальнейшего профессионального роста.',
    },
    {
        id: 105,
        title: 'Резюме: Content Writer',
        description:
            'Начинающий копирайтер с отличными навыками написания текстов и создания контента для сайтов и блогов.',
    },
    {
        id: 106,
        title: 'Резюме: IT Support Specialist',
        description:
            'Опыт работы в техподдержке, умение решать технические вопросы пользователей. Готов работать в поддержке IT-инфраструктуры.',
    },
];

export default function RecommendedResumesPage() {
    const router = useRouter();

    const handleResumeClick = (id: number) => {
        console.log('Resume clicked:', id);
        // При необходимости: router.push(`/resume/${id}`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <Container sx={{ py: 4 }}>
            {/* Header with back button and search field */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    Рекомендованные резюме
                </Typography>
                <TextField
                    placeholder="Поиск резюме"
                    variant="outlined"
                    size="small"
                />
            </Box>

            {/* Resumes List */}
            <Grid container spacing={3}>
                {recommendedResumes.map((resume) => (
                    <Grid item xs={12} key={resume.id}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Резюме
                            </Typography>
                            <Typography variant="h6">{resume.title}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {resume.description}
                            </Typography>
                            <Box textAlign="right" mt={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleResumeClick(resume.id)}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Подробнее
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
                {recommendedResumes.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            По вашему запросу резюме не найдено.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}