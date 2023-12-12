from django.db.models import Count
from django.shortcuts import render
from rest_framework import status
from rest_framework import generics,mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SpecialtyCountSerializer
from apiClinic.models import Patient,Doctor,Bookings
from apiClinic.serializers import PatientSerializer,DoctorSerializer,BookingsSerializer



# Create your views here.

# CRUD BASICO
class PatientList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get(self,request):
        return self.list(request)
    
    def post(self,request):
        return self.create(request)
    
class PatientDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get(self,request,pk):
        return self.retrieve(request,pk)
    
    def put(self,request,pk):
        return self.update(request,pk)
    
    def delete(self,request,pk):
        return self.delete(request,pk)
    
class DoctorList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get(self,request):
        return self.list(request)
    
    def post(self,request):
        return self.create(request)

class DoctorDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get(self,request,pk):
        return self.retrieve(request,pk)
    
    def put(self,request,pk):
        return self.update(request,pk)
    
    def delete(self,request,pk):
        return self.delete(request,pk)
    
class TopDoctorsList(generics.ListAPIView):
    queryset = Doctor.objects.order_by('-ranking').exclude(ranking__isnull=True)
    serializer_class = DoctorSerializer
    
    
class BookingsList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer
    
    def get(self,request):
        return self.list(request)
    
    def post(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        doctor_id = serializer.validated_data['doctor'].id
        
        doctor = Doctor.objects.get(id=doctor_id)

        
        doctor.available = False
        doctor.save()

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    
class BookingDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer
    
    def get(self,request,pk):
        return self.retrieve(request,pk)
    
    def put(self,request,pk):
        return self.update(request,pk)
    
    def delete(self,request,pk):
        return self.delete(request,pk)
    

class TopSpecialtiesList(APIView):
    def get(self, request):
        # Realiza el conteo de consultas por especialidad y ordénalas en orden descendente
        queryset = Bookings.objects.values('specialty').annotate(total=Count('specialty')).order_by('-total')

        # Serializa directamente el queryset con un nuevo serializador
        serializer = SpecialtyCountSerializer(queryset, many=True)
        return Response(serializer.data)



