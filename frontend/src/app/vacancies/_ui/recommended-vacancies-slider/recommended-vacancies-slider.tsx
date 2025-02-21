'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Box, Button, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CLIENT_MAP } from '@/common/constants';

interface Vacancy {
    id: number;
    title: string;
    description: string;
    salary: number;
}

interface RecommendedVacanciesSliderProps {
    vacancies: Vacancy[];
}

export const RecommendedVacanciesSlider = ({ vacancies }: RecommendedVacanciesSliderProps) => {
    const router = useRouter();

    const [slides, setSlides] = useState<Vacancy[][]>([]);

    useEffect(() => {
        const newSlides: Vacancy[][] = [];
        for (let i = 0; i < vacancies.length; i += 2) {
            newSlides.push(vacancies.slice(i, i + 2));
        }
        setSlides(newSlides);
    }, [vacancies]);

    const handleViewAll = () => {
        router.push(CLIENT_MAP.VACANCIES.RECOMMENDED);
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Рекомендованные вакансии</Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleViewAll}>
                    Все вакансии
                </Button>
            </Box>
            <Swiper
                spaceBetween={16}
                slidesPerView={3}
                modules={[Pagination]}
                pagination={{ clickable: true, type: 'bullets' }}
                className="p-2 pb-12"
            >
                {slides.map((pair, index) => (
                    <SwiperSlide key={index}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {pair.map((vacancy) => (
                                <Paper
                                    key={vacancy.id}
                                    sx={{
                                        p: 2,
                                        minHeight: '140px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h6">{vacancy.title}</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {vacancy.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        З/п: {vacancy.salary} руб.
                                    </Typography>
                                    <Box textAlign="right" mt={1}>
                                        <Button variant="outlined" size="small">
                                            Подробнее
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Fragment>
    );
};