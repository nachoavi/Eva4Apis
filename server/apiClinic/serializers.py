from rest_framework import serializers


from apiClinic.models import Patient,Doctor,Bookings

 
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'
        
class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = '__all__'
        
class SpecialtyCountSerializer(serializers.Serializer):
    specialty = serializers.CharField()
    total = serializers.IntegerField()


class TopPatientsSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField(source='patient__id')
    patient_name = serializers.CharField(source='patient__name')
    patient_lastname = serializers.CharField(source='patient__lastname')
    total_hours = serializers.IntegerField()
    
