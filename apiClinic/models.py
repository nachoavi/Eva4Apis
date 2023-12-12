from django.db import models

# Create your models here.
class Patient(models.Model):
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    class Meta:
        db_table = 'patients'
        
    def __str__(self):
        return self.name + ' ' + self.lastname


class Doctor(models.Model):
    name = models.CharField(max_length=50)
    specialty = models.CharField(max_length=50)
    available = models.BooleanField(default=True)
    ranking = models.DecimalField(max_digits=3, decimal_places=2,null=True, blank=True)
    class Meta:
        db_table = 'doctor'
        
    def __str__(self):
        return self.name + ' | ' + 'Especialidad: ' + self.specialty 



class Bookings(models.Model):
    booking_date = models.DateField()
    booking_hour = models.TimeField()
    doctor = models.ForeignKey(Doctor,on_delete=models.PROTECT)
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT)
    specialty = models.CharField(max_length=60)
    class Meta:
        db_table = 'bookings'