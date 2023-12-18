from django.contrib import admin
from django.urls import path
from apiClinic import views

urlpatterns = [
    path('patients/',views.PatientList.as_view()),
    path('patients/<int:pk>',views.PatientDetail.as_view()),
    path('patients/top',views.TopPatientsList.as_view()),
    path('doctors/',views.DoctorList.as_view()),
    path('doctors/<int:pk>',views.DoctorDetail.as_view()),
    path('doctors/top',views.TopDoctorsList.as_view()),
    path('bookings/',views.BookingsList.as_view()),
    path('bookings/<int:pk>',views.BookingDetail.as_view()),
    path('bookings/top-specialties/', views.TopSpecialtiesList.as_view()),
    path('bookings/top-booking-date/', views.TopBookingDate.as_view()),
] 