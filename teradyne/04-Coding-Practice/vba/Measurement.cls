VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "Measurement"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
' VBA class module: one measurement with limits.
Option Explicit

Private mSite As Long
Private mTest As String
Private mValue As Double
Private mLow As Double
Private mHigh As Double

Public Sub Init(site As Long, test As String, value As Double, lowLimit As Double, highLimit As Double)
    mSite = site
    mTest = test
    mValue = value
    mLow = lowLimit
    mHigh = highLimit
End Sub

Public Property Get Site() As Long
    Site = mSite
End Property

Public Property Get Passed() As Boolean
    Passed = (mValue >= mLow And mValue <= mHigh)
End Property

Public Function Describe() As String
    Describe = "Site " & mSite & " " & mTest & " = " & mValue & _
               " [" & mLow & ".." & mHigh & "] " & IIf(Passed, "PASS", "FAIL")
End Function
