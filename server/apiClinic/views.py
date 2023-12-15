from django.db.models import Count
from django.shortcuts import render
from rest_framework import status
from rest_framework import generics,mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from apiClinic.models import Patient,Doctor,Bookings
from apiClinic.serializers import PatientSerializer,DoctorSerializer,BookingsSerializer,TopPatientsSerializer,SpecialtyCountSerializer

 

# Create your views here.

# CRUD BASICO
class PatientList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get(self,request):
        if not self.queryset.exists():
            return Response({'message': 'No hay pacientes disponibles.'}, status=status.HTTP_404_NOT_FOUND)
        return self.list(request)
    
    def post(self,request):
        
        data = request.data
        if not data.get('name') or not data.get('lastname'):
            return Response({'error': 'Nombre y apellido son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request)
    
class PatientDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get(self,request,pk):
        if not self.queryset.exists():
            return Response({'message': 'No existe el paciente.'}, status=status.HTTP_404_NOT_FOUND)
        return self.retrieve(request,pk)
    
    def put(self,request,pk):
        return self.update(request,pk)
    
    def delete(self,request,pk):
        return self.destroy(request,pk)

class TopPatientsList(APIView):
    def get(self, request):
        queryset = Bookings.objects.values('patient__id', 'patient__name', 'patient__lastname').annotate(total_hours=Count('booking_hour')).order_by('-total_hours')        
        serializer = TopPatientsSerializer(queryset, many=True)
        return Response(serializer.data)
    
class DoctorList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get(self,request):
        if not self.queryset.exists():
            return Response({'message': 'No hay doctores disponibles.'}, status=status.HTTP_404_NOT_FOUND)
        return self.list(request)
    
    def post(self,request):
        data = request.data
        if not data.get('name') or not data.get('specialty') or not data.get('ranking'):
            return Response({'error': 'Nombre, especialidad y ranking son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)
        
        ranking = float(data.get('ranking'))
        if ranking > 5 or ranking < 1:
            return Response({'error': 'El ranking no puede ser superior a 5 o menor que 1.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request)

class DoctorDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get(self,request,pk):
        if not self.queryset.exists():
            return Response({'message': 'No existe este doctor.'}, status=status.HTTP_404_NOT_FOUND)
        return self.retrieve(request,pk)
    
    def put(self,request,pk):
        return self.update(request,pk)
    
    def delete(self,request,pk):
        return self.destroy(request,pk)
    
class TopDoctorsList(generics.ListAPIView):
    queryset = Doctor.objects.order_by('-ranking').exclude(ranking__isnull=True)
    serializer_class = DoctorSerializer
    
    
class BookingsList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer
    
    def get(self,request):
        if not self.queryset.exists():
            return Response({'message': 'No existen horas reservadas.'}, status=status.HTTP_404_NOT_FOUND)
        return self.list(request)
    
    def post(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        doctor_id = serializer.validated_data['doctor'].id
        
        doctor = Doctor.objects.get(id=doctor_id)
        if not doctor.available:
            return Response({'error': 'El doctor no esta disponible.'}, status=status.HTTP_400_BAD_REQUEST)
            
        
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
        return self.destroy(request,pk)
    

class TopSpecialtiesList(APIView):
    def get(self, request):
        queryset = Bookings.objects.values('specialty').annotate(total=Count('specialty')).order_by('-total')
        serializer = SpecialtyCountSerializer(queryset, many=True)
        return Response(serializer.data)




