'use client';
import React, { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Box, Button, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CLIENT_MAP } from '@/common/constants';

interface Resume {
    id: number;
    title: string;
    description: string;
    expectedSalary: number;
}

interface RecommendedResumesSliderProps {
    resumes: Resume[];
}

export const RecommendedResumesSlider = ({ resumes }: RecommendedResumesSliderProps) => {
    const router = useRouter();

    // Group resumes into pairs for each slide
    const slides: Resume[][] = [];
    for (let i = 0; i < resumes.length; i += 2) {
        slides.push(resumes.slice(i, i + 2));
    }

    const handleViewAll = () => {
        router.push(CLIENT_MAP.RESUMES.RECOMMENDED);
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Рекомендованные резюме</Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleViewAll}>
                    Все резюме
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
                            {pair.map((resume) => (
                                <Paper
                                    key={resume.id}
                                    sx={{
                                        p: 2,
                                        minHeight: '140px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        Резюме
                                    </Typography>
                                    <Typography variant="h6">{resume.title}</Typography>
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
                                        {resume.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Ожидаемая з/п: {resume.expectedSalary} руб.
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