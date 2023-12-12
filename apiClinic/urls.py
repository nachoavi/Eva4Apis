from django.contrib import admin
from django.urls import path
from apiClinic import views

urlpatterns = [
    path('patients/',views.PatientList.as_view()),
    path('patients/<int:pk>',views.PatientDetail.as_view()),
    path('doctor/',views.DoctorList.as_view()),
    path('doctor/<int:pk>',views.DoctorDetail.as_view()),
    path('bookings/',views.BookingsList.as_view()),
    path('bookings/<int:pk>',views.BookingDetail.as_view())
]