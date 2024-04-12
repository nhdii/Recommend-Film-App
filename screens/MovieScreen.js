import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import {HeartIcon } from 'react-native-heroicons/solid';
import { styles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from '../components/cast';
import MovieList from '../components/movieList';
import { fetchMovieCredits, fetchMovieDetails, fetchMovieSimilar, image500 } from '../api/moviedb';
import Loading from '../components/loading';
import Director from '../components/director';
import useAuth from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites, checkIsMovieFavorite} from '../utils/favorites';
import Alert from '../components/alert';

var {width, height} = Dimensions.get('window')
const android = Platform.OS == 'android';
const topMargin = android? ' mt-3': '';

export default function MovieScreen() {
    const {params: item} = useRoute();
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [cast, setCast] = useState([]);
    const [director, setDirector] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [movie, setMovie]= useState({});
    const { user } = useAuth(); 
    const [showAlert, setShowAlert] = useState(false); // State to control visibility of custom alert
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        getMovieDetails(item.id);
        getMovieCredits(item.id);
        getSimilarMovie(item.id);
        const checkIsFavorite = async () => {
            if (user && user.uid) {
                const isFavorite = await checkIsMovieFavorite(user.uid, item.id);
                setIsFavourite(isFavorite);
            }
        };

        checkIsFavorite();
    }, [item, user]); // Thêm isFavourite và user vào dependency array

    const getMovieDetails = async id=>{
        const data = await fetchMovieDetails(id);
        // console.log('got movie details: ', data);
        if(data) setMovie(data);
        setLoading(false);
    }

    const getMovieCredits = async id=>{
        const data = await fetchMovieCredits(id);
        // console.log('got movie credits: ', data.cast);
        if(data && data.cast) setCast(data.cast);

        // console.log('got movie credits: ', data.crew.find(member => member.job === 'Director'));
        if(data && data.crew){
            const directorData = data.crew.find(member => member.job === 'Director');
            if (directorData) {
                setDirector(directorData);
            }
        }
        // setLoading(false);
    }

    const getSimilarMovie = async id=>{
        const data = await fetchMovieSimilar(id);
        // console.log('got similar movie: ', data);
        if(data && data.results) setSimilarMovies(data.results);
    }

     // Hàm xử lý sự kiện nhấn vào biểu tượng yêu thích
    const handleToggleFavourite = () => {
        if (!user || !user.uid) {
            // Nếu người dùng chưa đăng nhập, chuyển hướng tới trang đăng nhập
            navigation.navigate('Login');
            return;
        }
        if (isFavourite) {
            removeFromFavorites(user.uid, movie.id);
            setIsFavourite(false); // Cập nhật trạng thái yêu thích
            setAlertMessage("Movie removed from favorites successfully"); // Cập nhật message cho trường hợp xóa phim khỏi yêu thích
            setShowAlert(true); // Hiển thị thông báo
        } else {
            addToFavorites(user.uid, movie.id);
            setIsFavourite(true); // Cập nhật trạng thái yêu thích
            setAlertMessage("Movie added to favorites successfully"); // Cập nhật message cho trường hợp thêm phim vào yêu thích
            setShowAlert(true); // Hiển thị thông báo
        }
    };

  return (
    <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        className="flex-1 bg-neutral-900"
    >
        <View className="w-full">
            {/* back button */}
            <SafeAreaView className={"absolute top-1 z-20 w-full flex-row justify-between items-center px-4 mt-10"} >
                <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleFavourite}>
                    <HeartIcon size="28" color={isFavourite? theme.background : "white"}/>
                </TouchableOpacity>
            </SafeAreaView>
            {
                loading ?(
                    <Loading />

                ):(
                    <View>
                        <Image 
                            // source={require('../assets/images/moviePoster1.png')}
                            source={{ uri: image500(movie?.poster_path)}}
                            style={{width, height: height*0.55}}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
                            style={{width, height: height*0.40}}
                            start={{x: 0.5, y: 0}}
                            end={{x: 0.5, y: 1}}
                            className="absolute bottom-0"
                        />
                    </View>
                )
            }

            
        </View>

        {/* movie detail */}
        <View style={{marginTop: -(height*0.09)}} className="space-y-3">
            {/* title */}
            <Text className="text-white text-center text-3xl font-bold tracking-wider">
                {movie?.title}
            </Text>
            {/* status, release, runtime */}
            {
                movie?.id?(
                    <Text className="text-neutral-400 font-semibold text-base text-center">
                        {movie?.status} • {movie?.release_date?.split('-')[0]} • {movie?.runtime} min
                    </Text>
                ): null
            }
            

            {/* genres */}
            <View className="flex-row justify-center mx-4 space-x-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        movie?.genres?.map((genres, index)=>{
                            let showDot = index+1 != movie.genres.length;
                            return (
                                <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                                    {genres?.name} {showDot? "• " : null}
                                </Text>
                            )
                        })
                    }
                </ScrollView>
                
            </View>

            {/* description */}
            <Text className="text-neutral-400 mx-4 tracking-wide">
                {movie?.overview}
            </Text>
        </View>

        {/* director  */}
        {director && Object.keys(director).length > 0 && <Director navigation={navigation} director={director}/>}

        {/* cast */}
        {cast.length>0 && <Cast navigation={navigation} cast={cast} />}
        
        {/* similar movies */}
        {similarMovies.length>0 && <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />}

        {/* Alert message update succesful */}
        <Alert 
            visible={showAlert} // Sửa tên prop thành visible
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            autoCloseTimeout={4000} // Đóng sau 3 giây
        />
    </ScrollView>
  )
}